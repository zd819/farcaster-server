import os
import sys
import json
from jsonschema import ValidationError
from preference_model import PreferenceInput
import openai

# Your OpenAI API key should be set as an environment variable for security reasons
openai.api_key = os.getenv("OPENAI_API_KEY")

# Read the serialized data from the command line argument
serialized_data = sys.argv[1]
data = json.loads(serialized_data)

# Validate the data using Pydantic
try:
    preference_input = PreferenceInput(**data)
except ValidationError as e:
    print(json.dumps({'error': 'Invalid input'}))
    sys.exit(1)

# Create a prompt for the LLM
prompt = f"Organize feed based on: {preference_input.preference_text}."

# Get the output from the LLM using OpenAI's API
try:
    llm_output = openai.Completion.create(
        engine="text-davinci-003", # Or whatever the latest engine version is
        prompt=prompt,
        max_tokens=100
    )
    # Extract the text of the response
    response_text = llm_output.choices[0].text.strip()
except Exception as e:
    print(json.dumps({'error': 'Error calling OpenAI API', 'details': str(e)}))
    sys.exit(1)

# Return the output
print(json.dumps({'llm_output': response_text}))

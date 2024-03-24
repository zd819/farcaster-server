# path_to_your_python_script.py
import sys
import json
from jsonschema import ValidationError
from preference_model import PreferenceInput
import llm  # This should be your module for interacting with the LLM

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

# Get the output from the LLM
# You will need to replace this with actual code to call your LLM
llm_output = llm.get_response(prompt)

# Return the output
print(json.dumps({'llm_output': llm_output}))

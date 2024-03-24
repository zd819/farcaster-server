# process_preference.py
import sys
import json
from openai.error import OpenAIError
from preference_model import PreferenceInput
import openai

# Load your OpenAI API key from an environment variable or secure storage
openai.api_key = 'your-openai-api-key'

def get_response(prompt):
    try:
        response = openai.Completion.create(
          engine="davinci",  # Choose the engine you wish to use
          prompt=prompt,
          max_tokens=150  # Adjust based on how long you expect the completion to be
        )
        return response.choices[0].text.strip()
    except OpenAIError as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)

if __name__ == "__main__":
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
    llm_output = get_response(prompt)

    # Return the output
    print(json.dumps({'llm_output': llm_output}))

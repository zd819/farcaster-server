# preference_model.py
from pydantic import BaseModel

class PreferenceInput(BaseModel):
    preference_text: str

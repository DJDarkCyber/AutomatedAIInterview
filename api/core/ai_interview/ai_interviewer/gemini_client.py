import google.generativeai as genai
import warnings
warnings.filterwarnings("ignore")

genai.configure(api_key="AIzaSyC8iFADVqI1W92fzDQ1BFoltGSOMlk68AY")

config = genai.GenerationConfig()


class Interviewer:
    def __init__(self, system_instruction, user_message, history_chat):
        self.model = genai.GenerativeModel(model_name="gemini-1.5-flash", system_instruction=system_instruction, generation_config=config)
        self.chat_session = self.model.start_chat(history=history_chat)
        self.user_message = user_message

    def get_response(self):
        response = self.chat_session.send_message(self.user_message)

        return response.text

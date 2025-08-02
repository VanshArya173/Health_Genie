import { SarvamAI } from "sarvamai";

class SarvamAIClient {
  constructor({ apiSubscriptionKey }) {
    // no `new` here — just assign the object
    this.client = SarvamAI;

    // Set the key (if required)
    this.client.apiSubscriptionKey = apiSubscriptionKey;
  }

  async textToSpeech(options) {
    return this.client.textToSpeech.convert(options);
  }
}

export { SarvamAIClient };

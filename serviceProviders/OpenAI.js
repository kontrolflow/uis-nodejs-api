const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAI {



    static async test() {
        console.log("testing")
        const openai = new OpenAIApi(configuration);

        const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "How are you?",
        });
        console.log(completion.data.choices[0]);
    }



    static async getFive() {
        console.log("get five")
        const openai = new OpenAIApi(configuration);

        let prompt = "Give me three brief example responses to someone that just said, "
        prompt += "Mike and I are able to open links now, but Peter still cannot.  He will discuss with Jerry at 4:15"
        console.log(prompt)
        const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 50,
        });
        console.log(completion.data.choices[0].text);

        let answersString = completion.data.choices[0].text

        const regex = /\n\n(.*)\n(.*)\n(.*)/;
        const answers = answersString.match(regex);

        console.log(answers)
        console.log(answers[1])
        console.log(answers[2])
        console.log(answers[3])

        return answers
    }

    static async prompt(prompt) {
        const openai = new OpenAIApi(configuration);

        console.log(prompt)
        const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 200,
        });
        console.log(completion.data.choices[0].text);
        return(completion.data.choices[0].text);
    }


}

module.exports = OpenAI
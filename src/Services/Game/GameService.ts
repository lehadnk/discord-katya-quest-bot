import User from "../../Models/User";
import QuestionsDAO from "../../DAO/QuestionsDAO";
import AppServiceContainer from "../../AppServiceContainer";
import Question from "../../Models/Question";

export default class GameService {
    questionsDao: QuestionsDAO = new QuestionsDAO(AppServiceContainer.db);

    public async getCurrentQuestion(user: User): Promise<Question>
    {
        return await this.questionsDao.get(user.level);
    }

    public async checkAnswer(user: User, answer: string): Promise<boolean>
    {
        let question = await this.getCurrentQuestion(user);
        return question.getAnswers().some((v) => v.toLowerCase() === answer.toLowerCase());
    }
}
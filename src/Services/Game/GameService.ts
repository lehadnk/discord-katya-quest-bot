import User from "../../Models/User";
import QuestionsDAO from "../../DAO/QuestionsDAO";
import AppServiceContainer from "../../AppServiceContainer";
import Question from "../../Models/Question";

export default class GameService {
    questionsDao: QuestionsDAO = new QuestionsDAO(AppServiceContainer.db);

    public async getNextQuestion(user: User): Promise<Question> {
        return await this.questionsDao.get(1);
    }
}
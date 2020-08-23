import User from "../../Models/User";
import QuestionsDAO from "../../DAO/QuestionsDAO";
import AppServiceContainer from "../../AppServiceContainer";
import Question from "../../Models/Question";
import UsersDAO from "../../DAO/UsersDAO";
import CheckAnswerResult from "../../DTO/CheckAnswerResult";

export default class GameService {
    questionsDao: QuestionsDAO = new QuestionsDAO(AppServiceContainer.db);
    userDao: UsersDAO = new UsersDAO(AppServiceContainer.db);

    public async getCurrentQuestion(user: User): Promise<Question>
    {
        return await this.questionsDao.get(user.level);
    }

    public async checkAnswer(user: User, answer: string): Promise<CheckAnswerResult>
    {
        let question = await this.getCurrentQuestion(user);

        let dto = new CheckAnswerResult();
        dto.isCorrect = question.getAnswers().some((v) => v.toLowerCase() === answer.toLowerCase());
        if (dto.isCorrect) {
            dto.message = question.complete_text;
            await this.userDao.advanceLevel(user);
        }

        return dto;
    }

    public async isActivePlayer(user: User): Promise<boolean>
    {
        let question = await this.getCurrentQuestion(user);
        return !!question;
    }
}
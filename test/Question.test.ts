import {expect} from "chai";
import Question from "../src/Models/Question";

describe('Tests Question', () => {
    it('should return correct hint count', () => {
        let question = new Question();
        question.hint = 'Test';
        question.hint2 = null;

        expect(question.getHintsAmount()).to.be.eq(1);

        question.hint2 = '';
        expect(question.getHintsAmount()).to.be.eq(1);

        question.hint2 = 'Test';
        expect(question.getHintsAmount()).to.be.eq(2);
    });
});
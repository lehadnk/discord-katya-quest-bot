import {expect} from "chai";
import onlyLetters from "../src/Helpers/String";

describe('Tests Question', () => {
    it('should return correct hint count', () => {
        let string = onlyLetters('Горд-унн&8\' и');
        expect(string).to.be.eq('Гордунни');
    });
});
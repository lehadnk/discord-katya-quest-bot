export default function onlyLetters(string: string) {
    return string.replace(/[^A-Za-zА-аЯ-я!?]/g,'');
}
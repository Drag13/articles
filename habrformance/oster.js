const path = 'http://lib.ru/ANEKDOTY/osterwred.txt';

var linesToHave = 16;
var f = true;

$0.textContent
    .split('\n')
    .filter((el) => el)
    .reduce((acc, el) => {
        if (el === 'x x x') {
            f = true;
        } else {
            if (f) { f = false; acc.push([el]); } else { acc[acc.length - 1].push(el); }
        }
        return acc;
    }, [])
    .filter((poem) => poem.length === linesToHave);

    
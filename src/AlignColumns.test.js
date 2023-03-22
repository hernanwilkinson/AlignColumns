/**
 *  @abstract
 */
class Alignment {
    /**
     *  @abstract
     */
    value(toAlign, size) {
    }
}

class LeftAlignment extends Alignment {
    value(toAlign, size) {
        return toAlign + ' '.repeat(size - toAlign.length)
    }
}

class RightAlignment extends Alignment {
    value(toAlign, size) {
        return ' '.repeat(size - toAlign.length) + toAlign
    }
}

class CenterAlignment extends Alignment {
    value(toAlign,size){
        const leftSpaces = Math.ceil((size - toAlign.length) / 2)
        const rightSpaces = size - toAlign.length - leftSpaces
        return ' '.repeat(leftSpaces) + toAlign + ' '.repeat(rightSpaces)
    }
}

class AlignColumns {
    _lines;

    constructor(lines, alignment = new LeftAlignment()) {
        this._lines = lines
        this._alignment = alignment;
    }

    value() {
        this.calculateMaxColumnSizes()

        return this.linesWithColumnsAligned()
    }

    linesWithColumnsAligned() {
        return this._lines.map(line => this.alignColumnOfLine(line))
    }

    alignColumnOfLine(line) {
        return this._maxColumnSizes.map((columnSize, columnIndex) => {
            const toAlign = line[columnIndex] ?? [];
            return this._alignment.value(toAlign,columnSize);
        })
    }

    calculateMaxColumnSizes() {
        this._maxColumnSizes = []
        this._lines.forEach( line => {
            line.forEach( (cell,index) => {
                this._maxColumnSizes[index] = Math.max(this._maxColumnSizes[index]??0,cell.length)
            })
        })
    }

    static from(input, alignment) {
        return new AlignColumns(this.linesWithColumnsFrom(input),alignment).value()
    }

    static linesWithColumnsFrom(input) {
        if (input.length == 0)
            return []
        else {
            const lines = input.split('\n')
            return lines.map(line => line.split('$'))
        }
    }

    static asString(input, alignment) {
        const linesWithAlignColumns = this.from(input,alignment)
        if(linesWithAlignColumns.length==0)
            return '**\n' +
                '||\n' +
                '**';
        else if(linesWithAlignColumns[0].length==1)
            return '*' + '-'.repeat((linesWithAlignColumns[0])[0].length)+ '*\n' +
                '|' + (linesWithAlignColumns[0])[0] + '|\n' +
                '*' + '-'.repeat((linesWithAlignColumns[0])[0].length)+ '*';
        else {
            const separator =
                linesWithAlignColumns[0]
                    .map( cell => '*' + '-'.repeat(cell.length) )
                    .reduce((prev,current) => prev + current, '') + '*'

            return separator +'\n' +
                linesWithAlignColumns[0]
                    .map( cell => '|' + cell )
                    .reduce((prev,current) => prev + current, '') + '|\n' +
                separator
        }
    }
}

describe('Align Columns suite', () => {
    test('Should return no lines when there are no lines with columns to align', () => {
        const alignColumns = new AlignColumns([])
        expect(alignColumns.value()).toEqual([])
    })

    test('Should return the line with the column when there is one line and column', () => {
        const alignColumns = new AlignColumns([['1234']])
        expect(alignColumns.value()).toEqual([['1234']])
    })

    test('Should return lines with its columns for same column size', () => {
        const alignColumns = new AlignColumns([['1234'],['abcd']])
        expect(alignColumns.value()).toEqual([['1234'],['abcd']])
    })

    test('Columns of different lines should have the same width', () => {
        const alignColumns = new AlignColumns([['1234'],['12']])
        expect(alignColumns.value()).toEqual([['1234'],['12  ']])
    })

    test('Max column width can be in any line', () => {
        const alignColumns = new AlignColumns([['12'],['1234']])
        expect(alignColumns.value()).toEqual([['12  '],['1234']])
    })

    test('Align lines with more than one column', () => {
        const alignColumns = new AlignColumns([['12','abc'],['1234','ab']])
        expect(alignColumns.value()).toEqual([['12  ','abc'],['1234','ab ']])
    })

    test('First line can have different number of columns', () => {
        const alignColumns = new AlignColumns([['12','abc'],['1234']])
        expect(alignColumns.value()).toEqual([['12  ','abc'],['1234','   ']])
    })

    test('Any line can have different number of columns', () => {
        const alignColumns = new AlignColumns([['12'],['1234','abc']])
        expect(alignColumns.value()).toEqual([['12  ','   '],['1234','abc']])
    })

    test('Can align to right', () => {
        const alignColumns = new AlignColumns([['12','abc'],['1234','a']], new RightAlignment())
        expect(alignColumns.value()).toEqual([['  12','abc'],['1234','  a']])
    })

    test('Alignment can be center', () => {
        const alignColumns = new AlignColumns([['12','abc'],['1234','ab']], new CenterAlignment())
        expect(alignColumns.value()).toEqual([[' 12 ','abc'],['1234',' ab']])
    })

    test('Can align an empty string', () => {
        const alignColumns = AlignColumns.from('', new CenterAlignment());
        expect(alignColumns).toEqual([])
    })

    test('Can align one line with one column', () => {
        const alignColumns = AlignColumns.from('123', new CenterAlignment());
        expect(alignColumns).toEqual([['123']])
    })

    test('Can align one lines with many columns', () => {
        const alignColumns = AlignColumns.from('123$abc', new CenterAlignment());
        expect(alignColumns).toEqual([['123','abc']])
    })

    test('Can align many lines with many columns', () => {
        const alignColumns = AlignColumns.from('123$abc\n1$a', new CenterAlignment());
        expect(alignColumns).toEqual([['123','abc'],[' 1 ',' a ']])
    })

    test('Can generate string output from empty input', () => {
        const stringOutput = AlignColumns.asString('', new CenterAlignment());
        expect(stringOutput).toEqual(
            '**\n' +
            '||\n' +
            '**')
    })

    test('Can generate string output one line with one column', () => {
        const stringOutput = AlignColumns.asString('123', new CenterAlignment());
        expect(stringOutput).toEqual(
            '*---*\n' +
            '|123|\n' +
            '*---*')
    })

    test('Can generate string output one line with many columns', () => {
        const stringOutput = AlignColumns.asString('123$a', new CenterAlignment());
        expect(stringOutput).toEqual(
            '*---*-*\n' +
            '|123|a|\n' +
            '*---*-*')
    })

})
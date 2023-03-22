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
        let linesWithColumns;
        if(input.length==0)
            linesWithColumns = []
        else {
            const lines = input.split('\n')
            linesWithColumns = lines.map(line => line.split('$'))
        }

        return new AlignColumns(linesWithColumns,alignment).value()
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
})
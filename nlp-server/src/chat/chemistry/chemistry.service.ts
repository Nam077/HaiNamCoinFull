import { Injectable } from '@nestjs/common';

export interface ChemistryResult {
    left: string[];
    right: string[];
    element: any;
    data: {
        dataLeft: any;
        dataRight: any;
    };
    result: {
        resultLeft: any;
        resultRight: any;
    };
    text: string;
}

@Injectable()
export class ChemistryService {
    public getChemistryEquationBalancer(str): ChemistryResult {
        //remove space
        str = str.replaceAll(' ', '');
        str = str.replaceAll('[', ')');
        str = str.replaceAll(']', ')');
        str = str.replaceAll('{', '(');
        str = str.replaceAll('}', ')');
        str = str.replaceAll('=>', '=');
        str = str.replaceAll('->', '=');
        str = str.replaceAll('⟶', '=');
        str = str.replaceAll('⇒', '=');
        str = str.replaceAll('⇔', '=');
        str = str.replaceAll('↔', '=');
        //get left right
        let left = str.split('=')[0];
        let right = str.split('=')[1];

        left = left.split('+');
        right = right.split('+');

        const dataLeft = {};
        for (const x in left) {
            dataLeft[left[x]] = this.componentAnalysis(left[x]);
        }

        const dataRight = {};
        for (const x in right) {
            dataRight[right[x]] = this.componentAnalysis(right[x]);
        }

        const element_HH = {};
        for (const x in dataLeft) {
            for (const y in dataLeft[x]) {
                element_HH[y] = (element_HH[y] != null ? element_HH[y] : 0) + 1;
            }
        }
        const N = left.length + right.length;
        let M = 0;
        for (const x in element_HH) {
            M++;
        }

        let arr = this.initArray(N, M);

        let i = 0;
        for (const x in element_HH) {
            let j = 0;
            for (const y in dataLeft) {
                arr[i][j++] = dataLeft[y][x] == null ? 0 : dataLeft[y][x];
            }
            for (const y in dataRight) {
                arr[i][j++] = dataRight[y][x] == null ? 0 : -dataRight[y][x];
            }
            i++;
        }
        console.log('arr', arr);
        arr = this.ladderMatrix(arr);
        console.log('arr1', arr);
        arr = this.diagonalMatrix(arr);
        console.log('arr2', arr);
        const result_array = this.getResultArray(arr);
        i = 0;
        const resultLeft = {};
        for (const y in dataLeft) {
            resultLeft[y] = result_array[i++];
        }
        const resultRight = {};
        for (const y in dataRight) {
            resultRight[y] = result_array[i++];
        }

        let text = '';
        for (const x in resultLeft) {
            text = text + (resultLeft[x] > 1 ? resultLeft[x] : '') + x + ' + ';
        }
        text = text.substring(0, text.length - 3);
        text = text + ' = ';
        for (const x in resultRight) {
            text = text + (resultRight[x] > 1 ? resultRight[x] : '') + x + ' + ';
        }
        text = text.substring(0, text.length - 3);

        return {
            left: left,
            right: right,
            element: element_HH,
            data: {
                dataLeft: dataLeft,
                dataRight: dataRight,
            },
            result: {
                resultLeft: resultLeft,
                resultRight: resultRight,
            },
            text: text,
        };
    }

    componentAnalysis(str) {
        str = str + 'Z';
        //Fe2(SO4)3
        const data = {};
        let element = '';
        let quantity = '';
        for (let i = 0; i < str.length; i++) {
            if (str[i] >= '0' && str[i] <= '9') {
                quantity = quantity + str[i];
            } else if (str[i] >= 'A' && str[i] <= 'Z') {
                if (element.length > 0) {
                    data[element] =
                        (typeof data[element] !== 'undefined' ? Math.floor(data[element]) : 0) +
                        (quantity.length > 0 ? Math.floor(Number(quantity)) : 1);
                    element = '';
                    quantity = '';
                }
                element = element + str[i];
            } else if (str[i] >= 'a' && str[i] <= 'z') {
                element = element + str[i];
            }
            if (str[i] === '(') {
                if (element.length > 0)
                    data[element] =
                        (typeof data[element] !== 'undefined' ? Math.floor(data[element]) : 0) +
                        (quantity.length > 0 ? Math.floor(Number(quantity)) : 1);
                element = '';
                quantity = '';
                let count = 1;
                let str2 = '';
                i++;
                while (count > 0 && i < str.length) {
                    if (str[i] === '(') count++;
                    if (str[i] === ')') count--;
                    if (count === 0) break;
                    str2 = str2 + str[i];
                    i++;
                }
                i++;
                while (str[i] >= '0' && str[i] <= '9' && i < str.length) {
                    quantity = quantity + str[i++];
                }
                i--;
                if (quantity.length == 0) quantity = '1';
                const sub_data = this.componentAnalysis(str2);
                for (const x in sub_data) {
                    data[x] = (data[x] != null ? data[x] : 0) + Math.floor(sub_data[x]) * Math.floor(Number(quantity));
                }
                element = '';
                quantity = '';
            }
        }
        return data;
    }

    initArray(N, M) {
        const arr = [];
        for (let i = 0; i < M; i++) {
            arr[i] = [];
            for (let j = 0; j < N; j++) {
                arr[i][j] = 0;
            }
        }
        return arr;
    }

    ladderMatrix(arr) {
        const M = arr.length;
        const N = arr[0].length;
        for (let i = 0; i < M - 1; i++) {
            let indexNotZero = i;
            for (let j = i; j < M; j++) {
                if (arr[j][i] != 0) {
                    const temp = arr[indexNotZero];
                    arr[indexNotZero] = arr[j];
                    arr[j] = temp;
                    indexNotZero++;
                }
            }
            for (let j = i; j < M; j++) {
                if (arr[j][i] < 0)
                    for (let k = i; k < N; k++) {
                        arr[j][k] *= -1;
                    }
            }
            for (let j = i + 1; j < M; j++) {
                if (arr[j][i] == 0) break;
                const lcm = Number(this.lcmTwoNumbers(arr[i][i], arr[j][i]));
                const k1 = lcm / arr[j][i];
                const k2 = lcm / arr[i][i];
                for (let k = 0; k < N; k++) {
                    arr[i][k] *= k2;
                    arr[j][k] *= k1;
                }
                for (let k = 0; k < N; k++) {
                    arr[j][k] -= arr[i][k];
                }
            }
        }
        for (let i = M - 1; i >= 0; i--) {
            let checkRowZero = true;
            for (let j = 0; j < N; j++) {
                if (arr[i][j] !== 0) {
                    checkRowZero = false;
                    break;
                }
            }
            if (checkRowZero) arr.splice(i, 1);
        }
        return arr;
    }

    diagonalMatrix(arr) {
        const M = arr.length;
        const N = arr[0].length;
        for (let i = M - 1; i >= 0; i--) {
            for (let j = i - 1; j >= 0; j--) {
                if (arr[j][i] == 0) continue;
                const lcm = Number(this.lcmTwoNumbers(arr[i][i], arr[j][i]));
                const k1 = lcm / arr[j][i];
                const k2 = lcm / arr[i][i];
                for (let k = 0; k < N; k++) {
                    arr[i][k] *= k2;
                    arr[j][k] *= k1;
                }
                for (let k = 0; k < N; k++) {
                    arr[j][k] -= arr[i][k];
                }
            }
        }
        return arr;
    }

    getResultArray(arr) {
        const M = arr.length;
        const N = arr[0].length;
        const result = [];
        let lcm = 1;
        for (let i = 0; i < M; i++) {
            lcm = Number(this.lcmTwoNumbers(lcm, arr[i][i]));
        }
        lcm = Math.abs(lcm);
        result[N - 1] = lcm;
        for (let i = M - 1; i >= 0; i--) {
            result[i] = (-lcm * arr[i][N - 1]) / arr[i][i];
        }
        let gcd = result[0];
        for (let i = 0; i < N; i++) {
            gcd = this.gcdTwoNumbers(gcd, result[i]);
        }
        for (let i = 0; i < N; i++) {
            result[i] /= gcd;
        }
        return result;
    }

    lcmTwoNumbers(x, y) {
        if (typeof x !== 'number' || typeof y !== 'number') return false;
        return !x || !y ? 0 : (x * y) / this.gcdTwoNumbers(x, y);
    }

    gcdTwoNumbers(x, y) {
        x = Math.abs(x);
        y = Math.abs(y);
        while (y) {
            const t = y;
            y = x % y;
            x = t;
        }
        return x;
    }
}

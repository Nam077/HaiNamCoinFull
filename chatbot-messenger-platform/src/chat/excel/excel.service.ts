import { Injectable } from '@nestjs/common';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export interface KeyI {
    name: string;
    value: string;
}

export interface ImageI {
    url: string;
}

export interface MessageI {
    value: string;
}

export interface LinkI {
    url: string;
    idFont: number;
}

export interface TagI {
    name: string;
}

export interface FontExcel {
    name: string;
    keys: KeyI[];
    images: ImageI[];
    messages: MessageI[];
    links: LinkI[];
    urlPost: string;
    description: string;
    tags: TagI[];
}

export interface ResponseExcel {
    name: string;
    keys: KeyI[];
    images: ImageI[];
    messages: MessageI[];
}

export interface DataSheet {
    fonts: FontExcel[];
    responses: ResponseExcel[];
}

@Injectable()
export class ExcelService {
    public async getDoc() {
        try {
            const PRIVATE_KEY =
                '-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDbRgEAqDYfGHlP\\npG2VkZ/JoZqE4I0g092ONA+X6mwokc7Z3GhkpYlGXWVEO+afUlaRei7PM+N7AR9q\\nQJ+0PlVjGuyor9iMCrnYBw//CQ8Sj+us/3Yzv6sbXifae1wUOjLc0Q6/Gx3nkXFQ\\nOKRtYcS8OrQQrj1hwkrT+jRzmHC2oIHVZlYyg5w3EHwSTNtcDOcn7WeHW+zJQwOB\\nGwQfoHoBo0bspK60k0nt8UvKMNdH0QfM5hYs/ZwyqPv8zatcjYXHBixS5DxMIQ07\\n5to/3SWbySZ3T9MiQPqABa9U/kMiLJQhzmLVZcqCqxZ14dk/a9wHrTw6izbN9nWp\\nIcnkmy8JAgMBAAECggEAAd75q8xOT5WIAHYtgghAx1R1OEh0ZSkFo+ddZt08VcbJ\\nD5prZh4e+x5EJVDyXXOTM0Z/fyteTSquk9D6w+EVyFoUFkw6J5drq/Rtzk4WRmEQ\\nazTFU45MFZhStFEB5sFzNRI6wzDw1ay2fVn0YONjuDxIfyLGJDnHZW0Qv5ftBfPk\\nhzStVqglJHm5pdfpFQR3wj/WjpMdijyiSB8jphomxTo4poffWe7UjbFtIYU/+V5A\\nyKh7g0atnWOmL1y0Agqf3FicJDRDz0nNj1mbeQeOkS7an2V9pXaUhw5+IIQM0PWr\\ntUkLunKY5Hm44qAFAUyw3GgG2XcNu0POylQlUglDIQKBgQD5r647oqOB6cPMoGK0\\nyeYHWwpWugc6gIfEFuU49DZ4/fTt2pw2wyvBQSVs5Wj3ezYTKTrNzegrmJQIz0+V\\nfr7R4Uev/XaOeTKzaLVo8Af9/0y/ycEiuXUgSvoyNdo+j9Z+yxqFYUpYzFG/y18D\\n5clBZzy0lXVvZAv6YDV6FUA/YQKBgQDg0XL1CsLqRjAmiMvp1Q/NEKcbhhWtwTjn\\nDxHd5556sHtDzSTssTYs0faBs1Y2E6ZGCHiF9ZcVIKCoBMgFT+h/iDc7xml1CJzR\\nu+v/M8eHhdyH1FJ9O/ZzPLkAoxMoEKKSaWm3ROuVO+n39FDpsK2c4+aKqZLlAVTC\\nS1YvCGhYqQKBgGekqSpQBJc0tfYGzXJGLJn5DH2bksyR9clLx7KwjLwEjtr818NT\\nmKILrMFbKQsxteyWPLaZNjqCh1Bw3ZQsnID6hotjJwdU/9rBKCx7FpY0l2M1GFqV\\nqSzScrDM8d7uThcrr8KV9AqQJY77mGFBzRy9AdHkCG9IlEBGF2ypzZWBAoGBAMQH\\nvb5PMOBIbUncdDmjb5C2mY+VXifQ2MYYzNJ6WSTP59uZ8D121C9GsTQs5NpoTc65\\nKiZcm+1vMsbuzF5da/RwGQFFI8VJyjvTKZewVaYlIcNKbtcGRwH6i7Izf8uqnace\\nxXBpZyYMRRnQ7hCm3utziR2VeSG4BGkaeb6vDRVpAoGAD+KOcnM8zDYGaAVl7kbh\\nUtkCLvo2t2SaAVTc6q4XvSlP6ot01Oo1J9L6+002s/teH0X3VkZc5LFVBBNRQGzu\\nVbSrb9JZWc2aW8d1vCsfKK53EsuyfpVRr/4MMzwuKoZfIhIU15WsYr43mHPK/m/J\\nvMzY8K6CmRL0TiMic8OZxMs=\\n-----END PRIVATE KEY-----\\n'.replace(
                    /\\n/g,
                    '\n',
                );

            const SHEET_ID = '1YF9E-5Z6dHRNHsI2SZVPTntWdM8UdkJ0BORelsnRTrg';
            const CLIENT_EMAIL = `nvnfont@nvnfont.iam.gserviceaccount.com`;
            const doc = new GoogleSpreadsheet(SHEET_ID);
            await doc.useServiceAccountAuth({
                client_email: CLIENT_EMAIL,
                private_key: PRIVATE_KEY,
            });
            await doc.loadInfo();
            return doc;
        } catch (error) {
            console.log(error);
        }
    }

    public removeVietnameseTones(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    public async getDataFromSheet(): Promise<DataSheet> {
        const doc = await this.getDoc();

        const sheetFont = doc.sheetsByIndex[0];
        const sheetResponse = doc.sheetsByIndex[1];
        const rowFonts = await sheetFont.getRows();
        const rowResponses = await sheetResponse.getRows();
        const fonts: FontExcel[] = this.getFontsByRow(rowFonts);
        const responses: ResponseExcel[] = this.getResponsesByRow(rowResponses);
        return { fonts, responses };
    }

    public getFontsByRow(rows: any): FontExcel[] {
        const fonts: FontExcel[] = [];
        rows.forEach((row, index) => {
            const dataTemp: DataExcel = this.getKeysMessagesImagesLinksTags(row);

            fonts.push({
                name: row.Name ?? 'Default' + index,
                images: dataTemp.images ?? null,
                keys: dataTemp.keys ?? null,
                messages: dataTemp.messages ?? null,
                links: dataTemp.links ?? null,
                urlPost: row.Post_Link ?? null,
                description: row.Description ?? `Font ${row.Name} rất đẹp`,
                tags: dataTemp.tags ?? null,
            });
        });
        return fonts;
    }

    public getResponsesByRow(rows: any): ResponseExcel[] {
        const responses: ResponseExcel[] = [];
        rows.forEach((row, index) => {
            const dataTemp: DataExcel = this.getKeysMessagesImagesLinksTags(row);

            responses.push({
                name: row.Name === '' ? 'Default' + index : row.Name,
                images: dataTemp.images ?? null,
                keys: dataTemp.keys ?? null,
                messages: dataTemp.messages ?? null,
            });
        });
        return responses;
    }

    public getKeysMessagesImagesLinksTags = (row: any): DataExcel => {
        let keys: string[] = [];
        const keysCheck: string[] = [];
        let keysUniq: KeyI[] = [];
        let messages: string[] = [];
        const messagesCheck: string[] = [];
        let messagesUniq: MessageI[] = [];
        let images: string[] = [];
        const imagesCheck: string[] = [];
        let imagesUniq: ImageI[] = [];
        let links: string[] = [];
        const linksCheck: string[] = [];
        let linksUniq: LinkI[] = [];
        let tags: string[] = [];
        const tagsCheck: string[] = [];
        let tagsUniq: TagI[] = [];
        if (row.Keys) {
            keys = row.Keys.split('\n')
                .map((key) => key.trim())
                .filter((key) => key !== '');
            keys.forEach((key) => {
                if (!keysCheck.includes(key)) {
                    keysCheck.push(key);
                    keysUniq.push({ name: key, value: key.toLowerCase() });
                }
            });
        } else {
            keysUniq = null;
        }
        if (row.Messages) {
            messages = row.Messages.split('---split---')
                .map((message) => message.trim())
                .filter((message) => message !== '');
            messages.forEach((message) => {
                if (!messagesCheck.includes(message)) {
                    messagesCheck.push(message);
                    messagesUniq.push({ value: message });
                }
            });
        } else {
            messagesUniq = null;
        }

        if (row.Images) {
            images = row.Images.split('\n')
                .map((image) => image.trim())
                .filter((image) => image !== '');
            images.forEach((image) => {
                if (!imagesCheck.includes(image)) {
                    imagesCheck.push(image);
                    imagesUniq.push({ url: image });
                }
            });
        } else {
            imagesUniq = null;
        }
        if (row.Links) {
            links = row.Links.split('\n')
                .map((link) => link.trim())
                .filter((link) => link !== '');
            links.forEach((link) => {
                if (!linksCheck.includes(link)) {
                    linksCheck.push(link);
                    linksUniq.push({ url: link, idFont: null });
                }
            });
        } else {
            linksUniq = null;
        }
        if (row.Tags) {
            tags = row.Tags.split('\n')
                .map((tag) => tag.trim())
                .filter((tag) => tag !== '');
            tags.forEach((tag) => {
                if (!tagsCheck.includes(tag)) {
                    tagsCheck.push(tag);
                    tagsUniq.push({ name: tag });
                }
            });
        } else {
            tagsUniq = null;
        }

        return { keys: keysUniq, messages: messagesUniq, images: imagesUniq, links: linksUniq, tags: tagsUniq };
    };
}

export interface DataExcel {
    keys: KeyI[] | null;
    messages: MessageI[] | null;
    images: ImageI[] | null;
    links: LinkI[] | null;
    tags: TagI[] | null;
}

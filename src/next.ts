import { Request, Response } from "express";
import { parse } from "url";
import next from "next";

export async function nextApp(dev: boolean){
    const app = next({ dev });
    const handle = app.getRequestHandler();
    await app.prepare();

    return (req: Request, res: Response) => {

        const parsedUrl = parse(req.url! || "", true);
        handle(req, res, parsedUrl);
    };
}
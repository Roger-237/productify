import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

export async function syncUser(req: Request, res: Response) {
    try {

        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ error: "Utilisateur non trouvé" });
        }

        const { email, name, iageurl } = req.body;

        if (!email || !name || !iageurl) {
            return res.status(400).json({ error: "Champs requis manquants" });
        }

        const user = await queries.upsertUser({
            id: userId,
            email,
            name,
            imageUrl: iageurl,
        });
        
        return res.status(200).json({ user });


        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Echec de la synchronisation de l'utilisateur" });
    }
};

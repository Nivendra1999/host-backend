import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : "ajey6162@gmail.com",
        pass : "aagdyeekdzhmkhft"
    }
});
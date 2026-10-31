import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

function getCredentials() {
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        try {
            return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
        } catch {
            return JSON.parse(Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON, 'base64').toString('ascii'));
        }
    }

    const localPath = path.join(process.cwd(), 'skills', 'ai-assistant-healer', 'credentials.json');
    if (fs.existsSync(localPath)) {
        return JSON.parse(fs.readFileSync(localPath, 'utf8'));
    }

    throw new Error('Google Drive credentials not found.');
}

async function fetchDriveFilesWithRetry(retries = 3, delay = 1000): Promise<any> {
    try {
        const creds = getCredentials();
        const auth = new google.auth.JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });

        const drive = google.drive({ version: 'v3', auth });
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

        const query = folderId
            ? `'${folderId}' in parents and trashed = false`
            : "trashed = false";

        const response = await drive.files.list({
            q: query,
            fields: 'files(id, name, mimeType, modifiedTime, size, webViewLink)',
            pageSize: 30,
        });

        return response.data.files || [];
    } catch (error: any) {
        if (retries > 1) {
            await new Promise((res) => setTimeout(res, delay));
            return fetchDriveFilesWithRetry(retries - 1, delay * 2);
        }
        throw error;
    }
}

export async function GET() {
    try {
        const files = await fetchDriveFilesWithRetry();
        return NextResponse.json({
            success: true,
            mode: 'CLOUD_DIRECT',
            files,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || 'ড্রাইভ সংযোগ ব্যর্থ হয়েছে' },
            { status: 500 }
        );
    }
}
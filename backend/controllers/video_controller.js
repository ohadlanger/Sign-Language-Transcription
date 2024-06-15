const path = require('path');
const os = require('os');
const crypto = require('crypto');
const fs = require('fs');
const { spawn } = require('child_process');

const pythonScriptFolder = path.join(__dirname, '../../model/script_files');

const activatePythonScript = (scriptName, args) => {
    var output = '';

    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['-m', scriptName, ...args], {
            cwd: pythonScriptFolder,
            env: { ...process.env, PYTHONPATH: pythonScriptFolder }
        } );

        pythonProcess.stdout.on('data', (data) => {
            const currnt_output = data.toString().trim();
            console.log(currnt_output);
            output += currnt_output;
        });


        pythonProcess.stderr.on('data', (data) => {
            const currentError = data.toString().trim();
            console.error(currentError);
        });

        pythonProcess.on('close', (code) => {
            console.log(`Process exited with code ${code}`);
            if (code !== 0) {
                reject(stderrOutput)
            }
            if (output.includes('Done Successfully...')) {
                resolve('Successful');
            }
            else {
                reject('Failed');
            }
        });
    });
};


const combine_video = async (req, res) => {
    const req_data = req.body;
    
    // Validate that all required fields are present
    if (!req_data.text_translation || !req_data.video || !req_data.sound_translation) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const tempDir = os.tmpdir();
        const uniqueFolderName = `temp-folder-${crypto.randomBytes(16).toString('hex')}`;
        const tempFolderPath = path.join(tempDir, uniqueFolderName);
        
        await fs.promises.mkdir(tempFolderPath);

        await fs.promises.writeFile(path.join(tempFolderPath, 'text_translation.txt'), req_data.text_translation);
        await fs.promises.writeFile(path.join(tempFolderPath, 'video.mp4'), req_data.video, 'base64');
        await fs.promises.writeFile(path.join(tempFolderPath, 'sound_translation.mp3'), req_data.sound_translation, 'base64');

        const pythonFile = path.join(pythonScriptFolder, 'video/bin.py');
        const args = [
            `--video_path=${path.join(tempFolderPath, 'video.mp4')}`, 
            `--audio_path=${path.join(tempFolderPath, 'sound_translation.mp3')}`, 
            `--subtitle_path=${path.join(tempFolderPath, 'text_translation.txt')}`, 
            `--output_path=${tempFolderPath}`
        ];

        try {
            const result = await activatePythonScript(pythonFile, args);

            if (result === 'Successful') {
                const data = await fs.promises.readFile(path.join(tempFolderPath, 'final_video.mp4'));
                res.send({ video: data.toString('base64') });
            } else {
                res.status(500).send('Failed to translate text');
            }  
        } catch (error) {
            res.status(500).send('Failed to translate text: ' + error);
        }
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        try {
            await fs.promises.rm(tempFolderPath, { recursive: true, force: true });
        } catch (cleanupError) {
            console.error('Failed to clean up temporary folder:', cleanupError);
        }
    }
};

module.exports = {
    combine_video
};
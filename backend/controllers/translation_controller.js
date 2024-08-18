const path = require('path');
const os = require('os');
const crypto = require('crypto');
const fs = require('fs');
const { spawn } = require('child_process');

const tempFolderPath = path.join(__dirname, '');


const processTranslation = async (req, res, options) => {
    const { pythonScript, outputFiles } = options;

    try {
        const videoFileData = req.body.videoFile;
        const videoFileName = req.body.fileName || 'video.mp4';

        if (!videoFileData) {
            return res.status(400).send('No video file data provided.');
        }

        const result = 'Successful'
        if (result == 'Successful') {
            var output = {};
            for (const [responseKey, outputFile] of Object.entries(outputFiles)) {
                let data = await fs.promises.readFile(path.join(tempFolderPath, outputFile));
                if (responseKey == 'voice_translation') {
                    data = data.toString('base64');
                }
                else {
                    data = data.toString();
                }
                output[responseKey] = data;
            }
            res.send(output);
        }
        else {
            res.status(500).send(`Failed to process`);
        }
    } catch (error) {
        res.status(500).send(`Failed to process: ${error.message}`);
    }
};

const translate_text = (req, res) =>  {
    processTranslation(req, res, {
        pythonScript: 'translation.bin',
        outputFiles: {text_translation: 'text_translation.txt'},
        additionalArgs: ['--text_translation=true']
    });
};

const translate_signwriting = (req, res) => {
    processTranslation(req, res, {
        pythonScript: 'translation.bin',
        outputFiles: {signWriting_translation: 'signWriting_translation.txt'},
        additionalArgs: ['--signWriting_translation=true']
    });
};

const translate_sound = (req, res) => {
    processTranslation(req, res, {
        pythonScript: 'translation.bin',
        outputFiles: {voice_translation: 'voice_translation.mp3'},
        additionalArgs: ['--voice_translation=true']
    });
};

const translate_all = (req, res) => {
    console.log("Translating all");
    processTranslation(req, res, {
        pythonScript: 'translation.bin',
        outputFiles: {
            text_translation: 'text_translation.txt',
            signWriting_translation: 'signWriting_translation.txt',
            voice_translation: 'voice_translation.mp3'
        },
        additionalArgs: ['--signWriting_translation=true', '--voice_translation=true', '--text_translation=true']
    });
};

module.exports = {
    translate_text,
    translate_signwriting,
    translate_sound,
    translate_all
};

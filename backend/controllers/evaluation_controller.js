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
            output += currnt_output;
        });


        pythonProcess.stderr.on('data', (data) => {
            const currentError = data.toString().trim();
            console.error(currentError);
        });

        pythonProcess.on('close', (code) => {
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


const calculate_evaluation = async (req, res) => {
    const req_data = req.body;
    
    // Validate that all required fields are present
    if (!req_data.hypothesis || !req_data.reference) {
        return res.status(400).send('Missing required fields');
    }
    try {
        hypothesis_without_enter = req_data.hypothesis.replace(/\n/g, '');
        reference_without_enter = req_data.reference.replace(/\n/g, '');
        file_data = hypothesis_without_enter + '\n' + reference_without_enter;
        const tempDir = os.tmpdir();
        const uniqueFolderName = `temp-folder-${crypto.randomBytes(16).toString('hex')}`;
        var tempFolderPath = path.join(tempDir, uniqueFolderName);
        var evaluation_file = path.join(tempFolderPath, 'evaluation.txt');
        var output_file = path.join(tempFolderPath, 'output.txt');
        await fs.promises.mkdir(tempFolderPath);
        await fs.promises.writeFile(evaluation_file, file_data);

        const pythonFile ='evaluation.bin';
        const args = [
            `--data_path=${evaluation_file}`,
            `--output_path=${output_file}`
        ];
        try {
            const result = await activatePythonScript(pythonFile, args);

            if (result == 'Successful') {
                const data = await fs.promises.readFile(path.join(tempFolderPath, 'output.txt'));
                res.send({ score: data.toString() });
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
    calculate_evaluation
};
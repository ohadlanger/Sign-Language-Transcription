const path = require('path');
const fs = require('fs');
const tempFolderPath = path.join(__dirname, '');

const combine_video = async (req, res) => {
    const req_data = req.body;
    
    // Validate that all required fields are present
    if (!req_data.text_translation || !req_data.video || !req_data.sound_translation) {
        return res.status(400).send('Missing required fields');
    }
    try {

        try {
            const result = 'Successful'

            if (result == 'Successful') {
                const data = await fs.promises.readFile(path.join(tempFolderPath, 'final_video.mp4'));
                const pose_data = await fs.promises.readFile(path.join(tempFolderPath, 'pose_video.mp4'));
                res.send({ video: data.toString('base64'),
                        skeletonVideo: pose_data.toString('base64')});
            } else {
                res.status(500).send('Failed to translate text');
            }  
        } catch (error) {
            res.status(500).send('Failed to translate text: ' + error);
        }
    } catch (error) {
        res.status(500).send(error.message);
    } 
};

module.exports = {
    combine_video
};
outputFiles = {
    text_translation: 'text_translation.txt',
    signWriting_translation: 'signWriting_translation.txt',
    voice_translation: 'voice_translation.txt'
}
for (const [responseKey, outputFile] of Object.entries(outputFiles)) {
    console.log(responseKey,"with", outputFile);
}
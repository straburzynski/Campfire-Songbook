const noteFromPitch = (frequency): number => {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    return Math.round(noteNum) + 69;
};

const frequencyFromNoteNumber = (note) => {
    return 440 * Math.pow(2, (note - 69) / 12);
};

const centsOffFromPitch = (frequency, note) => {
    return Math.floor(
        (1200 * Math.log(frequency / frequencyFromNoteNumber(note))) / Math.log(2)
    );
};

export { noteFromPitch, centsOffFromPitch };

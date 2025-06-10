function getGradeGroup(grade) {
    if (grade >= 1 && grade <= 4) return '1-4';
    if (grade >= 5 && grade <= 7) return '5-7';
    if (grade >= 8 && grade <= 10) return '8-10';
    return null;
}

module.exports = { getGradeGroup };

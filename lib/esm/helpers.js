export const radiansToDegrees = (rad) => {
    if (rad < 0) {
        // Correct the bottom error by adding the negative
        // angle to 360 to get the correct result around
        // the whole circle
        return 360 + rad * (180 / Math.PI);
    }
    else {
        return rad * (180 / Math.PI);
    }
};
export const getAngleUsingXAndY = (x, y) => {
    const radians = Math.atan2(y, x);
    const degrees = radiansToDegrees(radians);
    return degrees;
};
export const getDistanceBetweenTwoPoints = (aX, aY, bX, bY) => {
    return Math.hypot(aX - bX, aY - bY);
};

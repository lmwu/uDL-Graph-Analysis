// LTTB algorithm for downsampling time series data
// points: Array of {x, y}, threshold: number of points to keep
function lttb(points, threshold) {
    if (threshold >= points.length || threshold === 0) {
        return points; // Nothing to do
    }

    const sampled = [];
    const bucketSize = (points.length - 2) / (threshold - 2);
    let a = 0, maxAreaPoint, maxArea, area, avgX, avgY, rangeStart, rangeEnd;

    sampled.push(points[0]);

    for (let i = 0; i < threshold - 2; i++) {
        rangeStart = Math.floor((i + 1) * bucketSize) + 1;
        rangeEnd = Math.floor((i + 2) * bucketSize) + 1;
        rangeEnd = rangeEnd < points.length ? rangeEnd : points.length;

        avgX = 0;
        avgY = 0;
        for (let j = rangeStart; j < rangeEnd; j++) {
            avgX += points[j].x;
            avgY += points[j].y;
        }
        const rangeLength = rangeEnd - rangeStart;
        avgX /= rangeLength || 1;
        avgY /= rangeLength || 1;

        const rangeOffs = Math.floor(i * bucketSize) + 1;
        const rangeTo = Math.floor((i + 1) * bucketSize) + 1;

        maxArea = -1;
        for (let j = rangeOffs; j < rangeTo; j++) {
            area = Math.abs(
                (points[a].x - avgX) * (points[j].y - points[a].y) -
                (points[a].x - points[j].x) * (avgY - points[a].y)
            ) * 0.5;
            if (area > maxArea) {
                maxArea = area;
                maxAreaPoint = points[j];
            }
        }
        sampled.push(maxAreaPoint);
        a = points.indexOf(maxAreaPoint);
    }

    sampled.push(points[points.length - 1]);
    return sampled;
}

if (typeof module !== "undefined") {
    module.exports = lttb;
}

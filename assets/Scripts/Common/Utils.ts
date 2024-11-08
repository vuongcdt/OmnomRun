import { math, Quat, v3, Vec3 } from "cc";


export const rotatePointAroundY = (point: Vec3, angle: number): Vec3 => {
    const radian = math.toRadian(angle);

    const x = point.x * Math.cos(radian) + point.z * Math.sin(radian);
    const z = -point.x * Math.sin(radian) + point.z * Math.cos(radian);

    return new Vec3(x, point.y, z).subtract(v3(point.x, point.y));
}

export const rotatePointAroundCenter = (point: Vec3, center: Vec3, angle: number): Vec3 => {
    const radian = math.toRadian(angle);
    const subtract = point.clone().subtract(center);
    const dir = subtract.x / Math.abs(subtract.x);

    const translatedPoint = new Vec3(point.x - center.x, point.y - center.y, point.z - center.z);

    const x = translatedPoint.x * Math.cos(radian) + translatedPoint.z * Math.sin(radian);
    const z = -translatedPoint.x * Math.sin(radian) + translatedPoint.z * Math.cos(radian);

    const result = new Vec3(x + center.x, translatedPoint.y + center.y, dir * z + center.z);

    return result;
}

export const angleToQuaternion = (angle: number, axis: Vec3): Quat => {
    const radian = math.toRadian(angle);
    const quat = new Quat();
    Quat.fromAxisAngle(quat, axis, radian);

    return quat;
}
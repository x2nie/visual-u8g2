export function layerAt(x,y, layers){
    layers.forEach(assureBound);
    return layers.find(layer => {
        const box = layer.bound
        return (x >= box.x && x <= box.x + box.w &&
            y >= box.y && y <= box.y + box.h) 
    })
}

function assureBound(layer){
    if(layer.bound) return;
    let x,y,r,rx,ry,x2,y2;
    switch (layer.f) {
        case 'drawEllipse':
            [x,y,rx,ry] = layer.args
            layer.bound = {x: x-rx, y:y-ry, w:rx*2+1, h:ry*2+1}
            break;
    
        case 'drawDisc':
        case 'drawCircle':
            [x,y,r] = layer.args
            layer.bound = {x: x-r, y:y-r, w:r*2+1, h:r*2+1}
            break;
    
        case 'drawLine':
            [x,y,x2,y2] = layer.args
            if(x2<x) [x,x2] = [x2,x];
            if(y2<y) [y,y2] = [y2,y];
            layer.bound = {x, y, w:x2-x+1, h:y2-y+1}
            break;
    
        default:
            break;
    }
    console.log(layer.f, layer.bound)
}
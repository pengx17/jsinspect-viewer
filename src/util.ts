import { IJSInspectInstance, IJSInspectItem } from './type';

export function getLines(instance: IJSInspectInstance) {
  return instance.lines[1] - instance.lines[0] + 1;
}

export function getMax(instances: IJSInspectInstance[]) {
  return instances.reduce((accum, i) => Math.max(accum, getLines(i)), 0);
}

// Note: this function will mutate the original array
export function sortInspectItems(items: IJSInspectItem[]) {
  items.sort((ia, ib) => ib.instances.length - ia.instances.length);
  items.sort((ia, ib) => getMax(ib.instances) - getMax(ia.instances));
}

// ✅ Create a new file for in-memory image storage
// /lib/imageStore.ts

const imageStore: Record<string, { imageUrl: string; revisionMessage?: string }> = {};

export function storeImage(userId: string, cardId: string, imageUrl: string, revisionMessage?: string) {
  const key = `${userId}_${cardId}`;
  imageStore[key] = { imageUrl, revisionMessage };
}

export function getImage(userId: string, cardId: string) {
  const key = `${userId}_${cardId}`;
  return imageStore[key];
}

export function clearImage(userId: string, cardId: string) {
  const key = `${userId}_${cardId}`;
  delete imageStore[key];
}

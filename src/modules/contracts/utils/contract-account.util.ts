import { randomBytes } from 'crypto';

/** Bỏ dấu, slug ngắn cho email sinh tự động. */
export function slugifyWardName(name: string): string {
  const ascii = name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return ascii.slice(0, 48) || 'ward';
}

/** Ví dụ "Nguyễn Văn A" → "NVA". */
export function nameToInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const letters = parts
    .map((w) => {
      const first = [...w][0];
      return first ? first.toUpperCase() : '';
    })
    .join('');
  return letters.slice(0, 16) || 'X';
}

export function sanitizeRoomCodeForEmail(roomCode: string): string {
  return roomCode.replace(/[^a-zA-Z0-9-]/g, '-').slice(0, 32);
}

export function randomProvisionPassword(): string {
  return randomBytes(12).toString('base64url').slice(0, 16);
}

export function buildSyntheticEmailLocalPart(
  wardName: string,
  roomCode: string,
  representativeFullName: string,
): string {
  const w = slugifyWardName(wardName);
  const r = sanitizeRoomCodeForEmail(roomCode);
  const ini = nameToInitials(representativeFullName);
  return `${w}-${r}-${ini}`;
}

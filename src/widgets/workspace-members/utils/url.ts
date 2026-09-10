export function buildInviteUrl(inviteId: string): string {
  if (typeof window === 'undefined') {
    return `/join/${inviteId}`;
  }
  return `${window.location.origin}/join/${inviteId}`;
}

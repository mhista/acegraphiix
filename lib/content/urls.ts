/** Drive designs are served through our own route (/api/drive/[id]) so the page never depends on Drive's URLs. */
export const driveImage = (id: string, w = 1200) => `/api/drive/${encodeURIComponent(id)}?w=${w}`;

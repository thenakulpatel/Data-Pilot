export function getPhysicalTableName(
  projectId: string,
  table: string
) {

  const shortId =
    projectId
      .replace(/-/g, "")
      .slice(0, 8);

  return `proj_${shortId}_${table}`;
}
export const fetchISAInfo = async () => {
  const res = await fetch('/api/isa');

  if (res.status === 404) {
    return { error: 'NOT_FOUND' };
  }

  if (!res.ok) {
    return { error: 'UNKNOWN_ERROR', status: res.status };
  }

  return res.json();
};

export const deleteISA = async () => {
  const res = await fetch('/api/isa', {
    method: 'DELETE',
  });

  if (res.status === 404) {
    return { error: 'NOT_FOUND' };
  }

  if (!res.ok) {
    return { error: 'UNKNOWN_ERROR', status: res.status };
  }

  return res.json();
};

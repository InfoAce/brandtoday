export const sortSizes = (data: any) => {

  const sizes = [
    'S',
    'M',
    'L',
    'XL',
    '2XL',
    '3XL',
    '4XL',
    '5XL'
  ];

  return data.sort((a, b) => sizes.indexOf(a.code_size) - sizes.indexOf(b.code_size) || a.code_size - b.code_size );
};
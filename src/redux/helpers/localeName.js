const keepName = (name) => {
  return name;
};
const subwayName = (where) => {
  if (where) {
    switch (where.toLowerCase()) {
      case 'france': return 'Tramway RATP';
      case 'belgium': return 'Tramway RATP';
      case 'england': return 'Subway';
      case 'hong kong': return 'MTR';
      case 'singapore': return 'MRT';
      case 'scotland': return 'Clockwork Orange';
      default: return 'Tramway RATP';
    }
  }
  return 'Tramway RATP';
};

const bikeName = (country, city) => {
  if (country) {
    switch (country.toLowerCase()) {
      case 'belgium':
        return city && ['antwerp', 'antwerpen'].includes(city.toLowerCase()) ? 'Velo' : 'Villo';
      case 'luxembourg':
        return 'Veloh';
      default: return 'Velib';
    }
  }
  return 'Velib';
};

export default (type, country, city) => {
  switch (type) {
    case 'subway':
    case 'metro':
    case 'tramway':
      return subwayName(country);
    case 'velib':
    case 'velo':
    case 'villo':
      return bikeName(country, city);
    default:
      return keepName(type);
  }
};

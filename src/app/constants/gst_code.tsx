export const StateWithGSTCode = [
    {
        state: 'Jammu & Kashmir',
        code: '01'
    },
    {
        state: 'Himachal Pradesh',
        code: '02'
    },
    {
        state: 'Punjab',
        code: '03'
    },
    {
        state: 'Chandigarh',
        code: '04'
    },
    {
        state: 'Uttarakhand',
        code: '05'
    },
    {
        state: 'Haryana',
        code: '06'
    },
    {
        state: 'Delhi',
        code: '07'
    },
    {
        state: 'Rajasthan',
        code: '08'
    },
    {
        state: 'Uttar Pradesh',
        code: '09'
    },
    {
        state: 'Bihar',
        code: '10'
    },
    {
        state: 'Sikkim',
        code: '11'
    },
    {
        state: 'Arunachal Pradesh',
        code: '12'
    },
    {
        state: 'Nagaland',
        code: '13'
    },
    {
        state: 'Manipur',
        code: '14'
    },
    {
        state: 'Mizoram',
        code: '15'
    },
    {
        state: 'Tripura',
        code: '16'
    },
    {
        state: 'Meghalaya',
        code: '17'
    },
    {
        state: 'Assam',
        code: '18'
    },
    {
        state: 'West Bengal',
        code: '19'
    },
    {
        state: 'Jharkhand',
        code: '20'
    },
    {
        state: 'Odisha',
        code: '21'
    },
    {
        state: 'Chhattisgarh',
        code: '22'
    },
    {
        state: 'Madhya Pradesh',
        code: '23'
    },
    {
        state: 'Gujarat',
        code: '24'
    },
    {
        state: 'Daman and Diu',
        code: '25'
    },
    {
        state: 'Dadra and Nagar Haveli',
        code: '26'
    },
    {
        state: 'Maharashtra',
        code: '27'
    },
    {
        state: 'Andhra Pradesh',
        code: '28'
    },
    {
        state: 'Karnataka',
        code: '29'
    },
    {
        state: 'Goa',
        code: '30'
    },
    {
        state: 'Lakshadweep',
        code: '31'
    },
    {
        state: 'Kerala',
        code: '32'
    },
    {
        state: 'Tamil Nadu',
        code: '33'
    },
    {
        state: 'Puducherry',
        code: '34'
    },
    {
        state: 'Andaman and Nicobar Islands',
        code: '35'
    },
    {
        state: 'Telangana',
        code: '36'
    },
    {
        state: 'Andhra Pradesh (new)',
        code: '37'
    },
    {
        state: 'Ladakh',
        code: '38'
    }
]

export const getGSTCodeByStateName = (stateName: string) => {
  if (!stateName) return null;

  const matchedState = StateWithGSTCode.find(
    (stateObj) => stateObj.state.toLowerCase() === stateName.toLowerCase()
  );

  return matchedState ? matchedState.code : null;
};
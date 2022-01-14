// Constraint METHOD 
const API = { USER: `/user` };

async function fetchApi<T>(url, options: {method: 'GET'|'POST'}, mapper:(data:any)=> T):Promise<T> {
  const response = await Promise.resolve({
    url,
    method: options.method,
    data: JSON.stringify({ name: "Jhon", secondName: "Dou" }),
  });
  const result = mapper(JSON.parse(response.data));
  return result;
}

const userMapper = (data) => ({
  fullName: `${data.name} ${data.secondName}`,
});

(async function () {
  const result = await fetchApi<{fullName:string}>(
      API.USER, 
      { method: "POST" }, 
      userMapper
  );

  console.log(result.fullName);
})();

export const a= 1;
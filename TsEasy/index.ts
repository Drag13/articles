const API = { USER: `/user` };

async function fetchApi(url, options, mapper) {
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
  const result = await fetchApi(
      API.USER, 
      { method: "POST" }, 
      (data) => userMapper(data)
  );

  console.log(result.fullName);
})();

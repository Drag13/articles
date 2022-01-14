// Making mapper even better
enum API {
  USER = `/user`,
}

type DtoMapper<T> = (data: unknown) => T;

async function fetchApi<T>(
  url: API,
  options: { method: "GET" | "POST" },
  mapper: DtoMapper<T>
): Promise<T> {
  const response = await Promise.resolve({
    url,
    method: options.method,
    data: JSON.stringify({ name: "Jhon", secondName: "Dou" }),
  });
  const result = mapper(JSON.parse(response.data));
  return result;
}

const userMapper: DtoMapper<{ fullName: string }> = (data) => {
  if (!isUserDto(data)) {
    throw new Error("user dto is not in appropriate format");
  }

  return {
    fullName: `${data.name} ${data.secondName}`,
  };
};

const isUserDto = (d: any): d is { name: string; secondName: string } => {
  return (
    d != null &&
    typeof d === "object" &&
    typeof d.name === "string" &&
    typeof d.secondName === "string"
  );
};

(async function () {
  const result = await fetchApi<{ fullName: string }>(
    API.USER,
    { method: "POST" },
    userMapper
  );

  console.log(result.fullName);
})();

export const a = 1;

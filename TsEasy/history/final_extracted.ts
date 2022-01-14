enum API {
  USER = `/user`,
}

type DtoMapper<T> = (data: unknown) => T;
type FetchOptions = { method: "GET" | "POST" };

async function fetchApi<T>(
  url: API,
  options: FetchOptions,
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

type UserDto = { name: string; secondName: string };
const isUserDto = (data): data is UserDto => {
  return (
    data != null &&
    typeof data === "object" &&
    typeof data.name === "string" &&
    typeof data.secondName === "string"
  );
};

type AppUser = { fullName: string };
const userMapper: DtoMapper<AppUser> = (data) => {
  if (!isUserDto(data)) {
    throw new Error("user dto is not in appropriate format");
  }

  return {
    fullName: `${data.name} ${data.secondName}`,
  };
};

(async function () {
  const result = await fetchApi<AppUser>(
    API.USER,
    { method: "POST" },
    userMapper
  );

  console.log(result.fullName);
})();

export const a = 1;

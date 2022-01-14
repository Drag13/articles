// Making mapper even better
enum API {
  USER = `/user`,
}

type DtoMapper<T> = (data: unknown) => T;
type DtoMapperFactory = <T, K>(
  mapper: (d: K) => T,
  val: (d: any) => d is K
) => (d: unknown) => T;

const x: DtoMapperFactory = (m, v) => (d: unknown) => {
  if (v(d)) {
    return m(d);
  }
  throw new Error('Object invalid');
};


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

const c = x(userMapper, isUserDto)({});

export const a = 1;

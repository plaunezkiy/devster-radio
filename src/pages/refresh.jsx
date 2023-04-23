import { VscLoading } from "react-icons/vsc";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Refresh = () => {
  const router = useRouter();
  const { refresh_token } = router.query;

  useEffect(() => {
    if (refresh_token) {
      //   console.log(refresh_token);
      fetch("api/refresh_token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token }),
      })
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          }
          localStorage.removeItem("authData");
        })
        .then((data) => {
          if (!data) {
            return;
          }
          localStorage.setItem("authData", JSON.stringify(data));
          router.push("/demo");
        });
    }
  }, [refresh_token]);

  return (
    <div className="flex h-full items-center justify-center">
      <VscLoading className="w-32 h-32 animate-spin" />
    </div>
  );
};

export default Refresh;

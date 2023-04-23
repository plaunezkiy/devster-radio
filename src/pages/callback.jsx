import { VscLoading } from "react-icons/vsc";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Callback = () => {
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    if (code) {
      fetch("api/get_token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          localStorage.setItem("authData", JSON.stringify(data));
          router.push("/demo");
        });
    }
  }, [code]);

  return (
    <div className="flex h-full items-center justify-center">
      <VscLoading className="w-32 h-32 animate-spin" />
    </div>
  );
};

export default Callback;

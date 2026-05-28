import { logout }
    from "./logout";

export async function
    authenticatedFetch(

        input: RequestInfo,

        init?: RequestInit
    ) {

    // ================================================
    // TOKEN
    // ================================================

    const token =
        localStorage.getItem(
            "token"
        );

    // ================================================
    // NO TOKEN
    // ================================================

    if (!token) {

        logout();

        throw new Error(
            "Unauthorized"
        );
    }

    // ================================================
    // REQUEST
    // ================================================

    const response =
        await fetch(
            input,
            {

                ...init,

                headers: {

                    ...(init?.headers || {}),

                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

    // ================================================
    // UNAUTHORIZED
    // ================================================

    if (
        response.status === 401
    ) {

        logout();

        return Promise.reject(
            new Error(
                "Session expired"
            )
        );
    }
    // ================================================
    // SUCCESS
    // ================================================

    return response;
}
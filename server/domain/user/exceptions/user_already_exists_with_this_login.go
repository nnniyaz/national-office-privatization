package exceptions

import "github.com/nnniyaz/nop/server/pkg/core"

var ErrUserAlreadyExistsWithThisLogin = core.NewI18NError(core.ECONFLICT, core.TXT_USER_ALREADY_EXISTS_WITH_THIS_LOGIN)

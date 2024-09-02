package exceptions

import "github.com/nnniyaz/nop/server/pkg/core"

var ErrInvalidNpaLabel = core.NewI18NError(core.EINVALID, core.TXT_INVALID_NPA_TITLE)

package exceptions

import "github.com/nnniyaz/nop/pkg/core"

var ErrInvalidNewsTitle = core.NewI18NError(core.EINVALID, core.TXT_INVALID_NEWS_TITLE)
